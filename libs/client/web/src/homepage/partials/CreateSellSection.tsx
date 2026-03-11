import React from 'react';
import { Link } from 'react-router-dom';

import {
  SvgPropShip,
  SvgPropInteract,
  SvgPropShowcase,
  SvgPropScaleMethod,
} from '@your-props/client/icons';

export const CreateSellSection = () => {
  const data = [
    {
      title: 'Showcase Your Prop',
      description:
        'Add detailed descriptions and high-quality images to present your movie or TV prop.',
      icon: <SvgPropShowcase />,
      colorbg: 'icon-color1',
    },
    {
      title: 'Interact with the Community',
      description:
        "Join discussions, share your prop's story, and generate excitement among potential buyers.",
      icon: <SvgPropInteract />,
      colorbg: 'icon-color2',
    },
    {
      title: 'Choose Your Sale Method',
      description:
        'Set a fixed price, accept offers, or start an auction to find the right buyer.',
      icon: <SvgPropScaleMethod />,
      colorbg: 'icon-color3',
    },
    {
      title: 'Ship Your Prop',
      description:
        'Once sold, securely package and ship the prop to the buyer, and receive payment.',
      icon: <SvgPropShip />,
      colorbg: 'icon-color4',
    },
  ];
  return (
    <section className="tf-box-icon create style1 tf-section featured-props-section">
      <div className="pb-[89px]">
        <div className="themesflat-container">
          <div className="row">
            <div className="col-md-12">
              <div className="heading-live-auctions mg-bt-22">
                <h2 className="tf-title pb-17">How it Works</h2>
              </div>
            </div>
            {data.map((item, index) => (
              <CreateItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CreateItem = (props: any) => (
  <div className="col-lg-3 col-md-6 col-12">
    <div className="sc-box-icon">
      <div className="image">
        <div className={`icon-create ${props.item.colorbg}`}>
          {props.item.icon}
        </div>
      </div>
      <h3 className="heading text-left">
        <Link to="/">{props.item.title}</Link>
      </h3>
      <p className="content text-left">{props.item.description}</p>
    </div>
  </div>
);
